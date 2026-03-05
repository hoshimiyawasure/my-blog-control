<script setup lang="ts">
// 定义标签类型
interface Tag {
  id: number;
  name: string;
  color?: string; // 可选的颜色属性
}

// 标签列表数据
const tagList: Tag[] = [
  { id: 1, name: "css", color: "bg-blue-100 text-blue-800" },
  { id: 2, name: "html", color: "bg-green-100 text-green-800" },
  { id: 3, name: "javascript", color: "bg-yellow-100 text-yellow-800" },
  { id: 4, name: "vue", color: "bg-purple-100 text-purple-800" },
  { id: 5, name: "react", color: "bg-cyan-100 text-cyan-800" },
];

const blogList = await queryCollection("content").all();
console.log("blogList", blogList);
</script>

<template>
  <div>
    <!-- 内容区域,使用富文本编辑器控制内容 ，暂时用固定宽高-->
    <div class="content h-[300px]"></div>
    <BreadCrumb></BreadCrumb>

    <div class="flex flex-row items-start">
      <div class="list w-[80%]">
        <div class="text-[20px] py-[10px]">module title</div>
        <div
          v-for="(blog, index) in blogList"
          :key="index"
          class="item custom-border-lines"
        >
          <div class="text-[30px] font-bold">{{ blog.title }}</div>
          <div class="text-[20px] line-clamp-2 my-[10px]">
            {{ blog.description }}
          </div>
          <div
            class="text-[12px] text-gray-500 py-[5px] flex flex-row items-center justify-start gap-[10px]"
          >
            <div>状态:views</div>
            <div>状态:comments</div>
            <div>状态:public time</div>
          </div>
          <div class="flex flex-row justify-end pr-10 text-gray-500">
            <nuxt-link :to="`/blog${blog.path}`">阅读全文</nuxt-link>
          </div>
        </div>
      </div>
      <div class="w-[20%]">
        <div class="text-[20px] py-[10px]">module title</div>
        <div
          class="tags flex flex-row items-center justify-start gap-[10px] flex-wrap"
        >
          <!-- 基础标签 -->
          <div
            v-for="tag in tagList"
            :key="tag.id"
            :class="tag.color"
            class="hover:cursor-pointer tag inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
          >
            {{ tag.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.content {
  background-image: url("@/common/assets/images/background.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.custom-border-lines {
  position: relative;

  padding: 20px 0; /* 给内容一些内边距，避免与边线重叠 */
}
.custom-border-lines::before,
.custom-border-lines::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(to right, transparent, #f3f4f6 50%, transparent);
}

.custom-border-lines::before {
  top: 0;
}

.custom-border-lines::after {
  bottom: 0;
}
</style>
